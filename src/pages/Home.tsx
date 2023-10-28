import React from 'react';
import qs from 'qs';
import {  useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Sort, { sortList } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';


import Pagination from '../components/Pagination';

import {
  FilterSliceState,
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice';
import { SearchPizzaParams, fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';
import { useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const {items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

  const onChangeCategory = React.useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
  }, [dispatch]);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
    
    window.scrollTo(0, 0);
  };

  //  Если мы изменили параметры и был первый рендер, то делаем эту проверку
//   React.useEffect(() => {
//     if (isMounted.current) { 
//       const params = {
//         categoryId: categoryId > 0 ? categoryId : null,
//         sortProperty: sort.sortProperty,
//         currentPage,
//       };

//       const queryString = qs.stringify(params, { skipNulls: true });
   
//     navigate(`?${queryString}`);
//     }

//     if (!window.location.search) {
//       dispatch(fetchPizzas({} as SearchPizzaParams));
//     }
//  }, [categoryId, sort.sortProperty, searchValue, currentPage]);
  
  React.useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage])
  
  // Парсим параметры при первом рендере
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
  //     const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(setFilters({
  //       searchValue: params.search,
  //       categoryId: Number(params.category),
  //       currentPage: Number(params.currentPage),
  //       sort: sort || sortList[0],
  //     }),
  //     );
  //   }
  //   isMounted.current = true;
  // }, []);

  // Если был первый рендер, то запрашиваем пиццы
// React.useEffect(() => {
//   window.scrollTo(0, 0);

//   if (!isSearch.current) { 
//     getPizzas();
//   }

//   isSearch.current = false;
// eslint-disable-next-line react-hooks/exhaustive-deps
// }, [categoryId, sort.sortProperty, searchValue, currentPage]);
  
  const pizzas = items.map((obj: any) => (
   
      <PizzaBlock {...obj} />

  ));
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
          <div className='content__error-info'>
            <h2>Произошла ошибка 😕</h2>
            <p>К сожалению, не удалось получить пиццы. Попробуйте повторить запрос позже</p>
          </div>
        ) : (
          <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
        )}
      
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
