import React, { Component } from 'react';
import RecipeSummary from '../../components/RecipeSummaryBlock';
import { Button, Form, InputGroup, Col, Stack, Pagination, Spinner } from 'react-bootstrap';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import './RecipeList.scss';
import MainService from '../../services/mainService';
import { RecipeSummaryShort } from '../../types/recipes';
import { debounce, getRandomOfList, withRouter } from '../../utils';

interface RecipeListState {
  recipes: Array<RecipeSummaryShort>,
  recipesCount: number,
  currentPage: number | undefined,
  search: string,
  loading: boolean,
}

interface RecipeListProps {
  router: {
    params: { currentPage: string },
    searchParams: URLSearchParams,
  }
}

class RecipeList extends Component<RecipeListProps, RecipeListState> {
  private _listSize = 12;
  
  private _paginationReach = 2;
  
  constructor(props: RecipeListProps) {
    super(props);
    this.state = {
      recipes: [],
      recipesCount: 0,
      currentPage: undefined,
      search: '',
      loading: false,
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { currentPage } = this.props.router.params;
    const currentPageClean = currentPage !== undefined ? parseInt(currentPage, 10) : 0;
    const search = this.props.router.searchParams.get('search') ?? '';
    this.setState({ currentPage: currentPageClean, search });
  }
  
  async componentDidUpdate(_: any, prevState: RecipeListState) {
    if (this.state.currentPage !== prevState.currentPage) {
      await this.updateRecipeList(this.state.currentPage);
    }
  }

  updateRecipeListDebounced = debounce(this.updateRecipeList, this);
  handleInput(e: React.FormEvent<HTMLInputElement>) {
    const search = e.currentTarget.value;
    this.setState({ search });
    if (search.length >= 3 || search.length === 0) {
      this.updateRecipeListDebounced();
    }
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await this.updateRecipeList();
  }

  async updateRecipeList(requestedPage: number = 0): Promise<void> {
    this.setState({ loading: true });
    const result = await MainService.searchSummary(this.state.search, requestedPage, this._listSize);
    const maxPage = Math.floor((result.count-1)/this._listSize);
    let currentPage = requestedPage;
    if (currentPage === undefined || currentPage > maxPage || currentPage < 0) {
      currentPage = 0;
    }
    this.setState({ recipes: result.recipes, recipesCount: result.count, currentPage, loading: false });
  } 

  render() {
    return (
      <Col>
        <h1>Chercher une recette</h1>
        <Form onSubmit={this.handleSubmit}>
          <InputGroup id="searchBarWrapper">
            <Form.Control
              type="text" value={this.state.search} onInput={this.handleInput} maxLength={50}
              placeholder={getRandomOfList(['Lasagne', 'Pot au feu', 'Curry', 'Pizza', 'Navarin', 'Pancake'])}
            />
            <Button variant="outline-secondary" id="recipeSearchInput" type="submit">
              <FiSearch />
            </Button>
          </InputGroup>
        </Form>
        { this.state.loading ? 
          <Col className="d-flex justify-content-center mt-5">
            <Spinner animation="border" />
          </Col> :
          <div id="recipeListOuterWrapper">
            <ul id="recipeListWrapper">
              { this.state.recipes.length > 0 ? this.renderRecipeList() : this.renderNoRecipe() }
            </ul>
            { this.state.recipes.length > 0 ? this.renderPagination() : '' }
          </div>
        }
      </Col>
    );
  }

  renderRecipeList() {
    return (
      this.state.recipes.map(recipe => 
        <RecipeSummary recipe={recipe.summary} recipeId={recipe.slugId as string} key={recipe.slugId}></RecipeSummary>)
    );
  }

  buildUrl(index: number = 0, search: string = '') {
    return `/app/recipe/list/${index}${search !== '' ? `?search=${encodeURI(search)}` : ''}`;
  }

  renderPagination() {
    const maxPage = Math.floor((this.state.recipesCount-1)/this._listSize);
    const currentPage = this.state.currentPage ?? 0;
    const search = this.state.search;
    
    let hasEllipsis = false;
    const paginationStart = [];
    for (let i = currentPage - 1; i >= 0; i--) {
      if (i > currentPage - 1 - this._paginationReach) {
        paginationStart.push(<Pagination.Item key={`p_${i}`} href={this.buildUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (i === 0) { //first page
        paginationStart.push(<Pagination.Item key={`p_${i}`} href={this.buildUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (!hasEllipsis) {
        hasEllipsis = true;
        paginationStart.push(<Pagination.Ellipsis key={`p_${i}`}></Pagination.Ellipsis>);
      }
    }
    paginationStart.reverse();
    hasEllipsis = false;
    const paginationEnd = [];
    for (let i = currentPage + 1; i <= maxPage; i++) {
      if (i < currentPage + 1 + this._paginationReach) {
        paginationEnd.push(<Pagination.Item key={`p_${i}`} href={this.buildUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (i === maxPage) { //last page
        paginationEnd.push(<Pagination.Item key={`p_${i}`} href={this.buildUrl(i, search)}>{i+1}</Pagination.Item>);
      } else if (!hasEllipsis) {
        hasEllipsis = true;
        paginationEnd.push(<Pagination.Ellipsis key={`p_${i}`}></Pagination.Ellipsis>);
      }
    }
    return (
      <Pagination>
        {this.state.currentPage !== 0 && <Pagination.First href={this.buildUrl(0, search)} />}
        {this.state.currentPage !== 0 && <Pagination.Prev href={this.buildUrl(currentPage - 1, search)} />}
        {paginationStart.map(v => v)}
        <Pagination.Item active>{currentPage + 1}</Pagination.Item>
        {paginationEnd.map(v => v)}
        {this.state.currentPage !== maxPage && <Pagination.Next href={this.buildUrl(currentPage + 1, search)} />}
        {this.state.currentPage !== maxPage && <Pagination.Last href={this.buildUrl(maxPage, search)} />}
      </Pagination>
    );
  }

  renderNoRecipe() {
    return (
      <Stack gap={3} id="noRecipeWrapper">
        <FiXCircle size="3em" color="var(--mp-danger)" />
        <span className="mainMessage">Pas de recette correspondante à ce terme</span>
        <span>Précisez votre recherche</span>
      </Stack>
    );
  }
}

export default withRouter(RecipeList);