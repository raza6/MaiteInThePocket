import { Component } from 'react';
import MainService from '../../services/mainService';
import { Recipe } from '../../types/recipes';
import { withParams } from '../../utils';

class RecipeDetail extends Component<{ params: { id: string } }, { recipe: Recipe | undefined }> {
    constructor(props: { params: { id: string } }) {
        super(props);
        this.state = {
          recipe: undefined 
        };
    }

    async componentDidMount() {
        let { id } = this.props.params;
        const recipe = await MainService.getRecipe(id);
        this.setState({ recipe });
    }

    render() {
        return (
        <div className="col">
            <h1>{this.state.recipe?.summary.name}</h1>
        </div>
        )
    }
}

export default withParams(RecipeDetail);