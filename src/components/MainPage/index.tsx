import React, { FormEvent, useEffect, useState, UIEvent } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import copy from 'copy-to-clipboard';

import Loader from '../Loader';
import IconSortable from '../icons/sortable';
import IconSortedAsc from '../icons/sorted-asc';
import IconSortedDesc from '../icons/sorted-desc';
import IconCopy from '../icons/copy';

import { getShortUrl, SQUEEZE_URL, STATISTICS_URL } from '../../tools/api-list';

import './style.css';

interface IStatisticItem {
  id: number;
  short: string;
  target: string;
  counter: number;
}

const STATISTIC_REQUEST_LIMIT = 50;

const MainPage = () => {
  const [link, setLink] = useState<string>('');
  const [statistic, setStatistic] = useState<Array<IStatisticItem>>([]);
  const [sort, setSort] = useState<{ [key: string]: 'asc' | 'desc' | null }>({});
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNextOffset, setHasNextOffset] = useState<boolean>(false);

  const getStatistic = (offset: number) => {
    setLoading(true);
    const params = new URLSearchParams();

    params.append('offset', String(offset));
    params.append('limit', String(STATISTIC_REQUEST_LIMIT));

    Object.keys(sort).forEach((key) => {
      if (sort[key] === 'asc') {
        params.append('order', `asc_${key}`);
      } else if (sort[key] === 'desc') {
        params.append('order', `desc_${key}`);
      }
    })

    axios(STATISTICS_URL, {
      headers: {
        'accept': 'application/json',
      },
      params,
    })
      .then((resp) => {
        setStatistic((prev) => [...prev, ...resp.data]);
        setHasNextOffset(resp.data.length === STATISTIC_REQUEST_LIMIT)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      })
  };

  useEffect(() => {
    setStatistic([]);
    setOffset(0);
    getStatistic(0);
  }, [sort]);

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios(SQUEEZE_URL, {
      method: 'POST',
      headers: { 'accept': 'application/json' },
      params: { link }
    })
      .then((resp) => {
        setStatistic((prev) => {
          return [resp.data, ...prev]
        })
      })
  };

  const onScrollList = debounce((e: UIEvent<HTMLDivElement>) => {
    const elem = e.target as Element;
    const scrolledToBottom = elem?.scrollTop + elem?.clientHeight + 50 >= elem?.scrollHeight;
    if (scrolledToBottom && hasNextOffset) {
      setOffset((prev) => {
        const newOffset = prev + STATISTIC_REQUEST_LIMIT;

        getStatistic(newOffset);

        return newOffset;
      });
    }
  }, 200);

  const elSortIcon = (name: string) => {
    if (sort[name] === 'asc') {
      return <IconSortedAsc/>;
    } else if (sort[name] === 'desc') {
      return <IconSortedDesc/>;
    }

    return <IconSortable/>;
  };

  const onClickIconSort = (name: string) => {
    if (!sort[name]) {
      setSort((prev) => ({ ...prev, [name]: 'asc' }));
    } else if (sort[name] === 'asc') {
      setSort((prev) => ({ ...prev, [name]: 'desc' }));
    } else {
      setSort((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className='container'>
      <div className='container__new-link'>
        <form onSubmit={onFormSubmit} className=''>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className='container__new-link-input'
          />
          <button type='submit' className='container__new-link-button'>Отправить</button>
        </form>
      </div>
      <div>
        <table className='container__table container__table_thead'>
          <thead>
          <tr className='container__table-names'>
            <th>Id</th>
            <th>
              <div className='container__table-sort' onClick={() => onClickIconSort('short')}>
                Короткая ссылка {elSortIcon('short')}
              </div>
            </th>
            <th>
              <div className='container__table-sort' onClick={() => onClickIconSort('target')}>
                Исходная ссылка {elSortIcon('target')}
              </div>
            </th>
            <th>
              <div className='container__table-sort' onClick={() => onClickIconSort('counter')}>
                Количество переходов {elSortIcon('counter')}
              </div>
            </th>
          </tr>
          </thead>
        </table>
        <div onScroll={onScrollList} style={{ height: '500px', overflowY: 'auto' }}>
          <table className='container__table'>
            <tbody>
            {statistic.map((item, index) => {
              const shortLink = getShortUrl(item.short);

              return (
                <tr key={`${index}-${item?.short}`} className='container__table-values-item'>
                  <td>{item.id}</td>
                  <td>
                    <div className='container__table-short-link'>
                      <a target='_blank' rel="noreferrer" href={shortLink}>
                        {shortLink}
                      </a>
                      <span
                        className='container__table-short-link-icon-copy'
                        onClick={() => copy(shortLink)}
                      >
                        <IconCopy/>
                      </span>
                    </div>
                  </td>
                  <td>{item.target}</td>
                  <td>{item.counter}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
          {loading && <Loader />}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
