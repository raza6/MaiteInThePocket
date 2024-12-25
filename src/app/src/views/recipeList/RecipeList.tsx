import React, { useEffect, useState } from 'react';
import RecipeSummary from '../../components/RecipeSummaryBlock';
import { Button, Form, InputGroup, Col, Stack, Pagination, Spinner } from 'react-bootstrap';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import './RecipeList.scss';
import RecipeService from '../../services/recipeService';
import { RecipeSummaryShort } from '../../types/recipes';
import { getRandomOfList, useDebounce, useHasChanged } from '../../utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GenProps } from '../../types/generic';

function RecipeList(props: GenProps) {
  // State
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Array<RecipeSummaryShort>>([]);
  const [recipesCount, setRecipesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Constant
  const _listSize = 12;
  const _paginationReach = 2;

  // Circumstantial
  const { currentPage: currentPageInit } = useParams();
  const searchInit = useSearchParams()[0].get('search') ?? '';
  const currentPageChanged = useHasChanged(currentPage);
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentPageClean = currentPageInit !== undefined ? parseInt(currentPageInit, 10) : 0;
    setCurrentPage(currentPageClean);
    setSearch(searchInit);
    props.pageName('Recherche');
  }, []);

  useEffect(() => {
    if (currentPageChanged) {
      updateRecipeList(currentPage, search);
    }
  }, [currentPage]);

  useEffect(() => {
    const searchValueFromUrl = searchParams.get('search') ?? '';
    if (searchValueFromUrl !== search) {
      updateRecipeList(0, searchValueFromUrl);
    }
  }, [searchParams]);

  const updateSearchUrl = (upcomingPage: number, upcomingSearch: string) => {
    if (currentPage !== undefined) {
      const currentSearchParam = searchParams.get('search') ?? '';
      const needUrlUpdate = upcomingSearch !== currentSearchParam || upcomingPage !== currentPage;
  
      if (needUrlUpdate) {
        navigate(buildPaginationUrl(upcomingPage, upcomingSearch));
      }
    }
  };

  const updateRecipeList = async (requestedPage: number = 0, requestedSearch: string = ''): Promise<void> => {
    setLoading(true);

    const result = await RecipeService.searchSummary(requestedSearch, requestedPage, _listSize);
    const maxPage = Math.floor((result.count-1)/_listSize);
    let upcomingPage = requestedPage;
    if (upcomingPage === undefined || upcomingPage > maxPage || upcomingPage < 0) {
      upcomingPage = 0;
    }
    updateSearchUrl(upcomingPage, requestedSearch);

    setSearch(requestedSearch);
    setCurrentPage(upcomingPage);
    setRecipes(result.recipes);
    setRecipesCount(result.count);
    setLoading(false);
  };

  const updateRecipeListDebounced = useDebounce(updateRecipeList);
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    setSearch(search);
    if (search.length >= 3 || search.length === 0) {
      updateRecipeListDebounced(0, search);
    }
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateRecipeList();
  };
  
  const renderRecipeList = () => {
    return (
      recipes.map(recipe => 
        <RecipeSummary recipe={recipe.summary} recipeId={recipe.slugId as string} key={recipe.slugId}></RecipeSummary>)
    );
  };

  const renderNoRecipe = () => {
    return (
      <Stack gap={3} id="noRecipeWrapper">
        <FiXCircle size="3em" color="var(--mp-danger)" />
        <span className="mainMessage">Pas de recette correspondante à ce terme</span>
        <span>Précisez votre recherche</span>
      </Stack>
    );
  };

  const buildPaginationUrl = (index: number = 0, search: string = '') => {
    return `/app/recipe/list/${index}${search !== '' ? `?search=${encodeURI(search)}` : ''}`;
  };

  const renderPagination = () => {
    const maxPage = Math.floor((recipesCount-1)/_listSize);
    const currentPageFromState = currentPage ?? 0;
    
    let hasEllipsis = false;
    const paginationStart = [];
    for (let i = currentPageFromState - 1; i >= 0; i--) { // Scan to the left
      if (i > currentPageFromState - 1 - _paginationReach) { // Between first page and min reach
        paginationStart.push(<Pagination.Item key={`p_${i}`} href={buildPaginationUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (i === 0) { // First page
        paginationStart.push(<Pagination.Item key={`p_${i}`} href={buildPaginationUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (!hasEllipsis) {
        hasEllipsis = true;
        paginationStart.push(<Pagination.Ellipsis key={`p_${i}`}></Pagination.Ellipsis>);
      }
    }
    paginationStart.reverse();
    hasEllipsis = false;
    const paginationEnd = [];
    for (let i = currentPageFromState + 1; i <= maxPage; i++) { // Scan to the right
      if (i < currentPageFromState + 1 + _paginationReach) { // Between last page and max reach
        paginationEnd.push(<Pagination.Item key={`p_${i}`} href={buildPaginationUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (i === maxPage) { // Last page
        paginationEnd.push(<Pagination.Item key={`p_${i}`} href={buildPaginationUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (!hasEllipsis) {
        hasEllipsis = true;
        paginationEnd.push(<Pagination.Ellipsis key={`p_${i}`}></Pagination.Ellipsis>);
      }
    }
    return (
      <Pagination>
        {currentPageFromState !== 0 && <Pagination.First href={buildPaginationUrl(0, search)} />}
        {currentPageFromState !== 0 && <Pagination.Prev href={buildPaginationUrl(currentPageFromState - 1, search)} />}
        {paginationStart.map(v => v)}
        <Pagination.Item active>{currentPageFromState + 1}</Pagination.Item>
        {paginationEnd.map(v => v)}
        {currentPageFromState !== maxPage && <Pagination.Next href={buildPaginationUrl(currentPageFromState + 1, search)} />}
        {currentPageFromState !== maxPage && <Pagination.Last href={buildPaginationUrl(maxPage, search)} />}
      </Pagination>
    );
  };

  return (
    <Col id="recipeListMainWrapper">
      <h1 className="laptop">Chercher une recette</h1>
      <Form onSubmit={handleSubmit}>
        <InputGroup id="searchBarWrapper">
          <Form.Control
            type="text" value={search} onInput={handleInput} maxLength={50}
            placeholder={getRandomOfList(['Lasagne', 'Pot au feu', 'Curry', 'Pizza', 'Navarin', 'Pancake'])}
          />
          <Button variant="outline-secondary" id="recipeSearchInput" type="submit">
            <FiSearch />
          </Button>
        </InputGroup>
      </Form>
      { loading ? 
        <Col className="d-flex justify-content-center mt-5">
          <Spinner animation="border" />
        </Col> :
        <div id="recipeListOuterWrapper">
          { recipes.length > 0 ? 
            <ul id="recipeListWrapper">
              { renderRecipeList() }
            </ul>
            : renderNoRecipe() 
          }
          { recipes.length > 0 ? renderPagination() : '' }
        </div>
      }
    </Col>
  );
}

export default RecipeList;