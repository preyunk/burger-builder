import React, {Component} from 'react';
import Aux from '../../hoc/Auxilliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    meat: 1.3,
    cheese: 0.4
};
class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        console.log('Inside Component Did mount');
        axios.get('https://pk-burger.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error:  true});
            });
    }
    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(key => {
                return ingredients[key]
            }).reduce((sum,element) => {
                return sum + element
            },0);
        this.setState( {
            purchasable: sum>0
        });


    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients ={
            ...this.state.ingredients
        };
      updatedIngredients[type] = updatedCount;
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice + INGREDIENT_PRICES[type];
      this.setState({
          totalPrice: newPrice,
          ingredients: updatedIngredients
      });
        this.updatePurchaseState(updatedIngredients);
    };
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
            return;
        const updatedCount = oldCount-1;
        const updatedIngredients ={
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type];
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    };
    purchaseHandler = () => {
        this.setState({ purchasing: true});
    };

    purchaseCanceled = () => {
        this.setState({purchasing: false});
    };
    purchaseContinue = () => {
        //alert("You Continue !");
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Priyank',
                address: {
                    street: 'A/4',
                    zipcode: 100000,
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
                //console.log(response);
            }).catch(error => {
            this.setState({loading: false, purchasing: false});
                //console.log(error);
        });
    };
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;

        let burger =this.state.error ?<p>Ingredients can't be loaded</p> :<Spinner/>;
        if(this.state.ingredients) {
            burger = <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    price={this.state.totalPrice}
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                    purchasable={this.state.purchasable}/>


            </Aux>;
            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                                             purchaseCanceled={this.purchaseCanceled}
                                             purchaseContinued={this.purchaseContinue}/>;
        }
        if(this.state.loading) {
            orderSummary = <Spinner/>;
        }

        // {salad: true, meat: false...}
        return (
            <Aux>


                <Modal showed={this.state.purchasing} modalClosed={this.purchaseCanceled}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
export default withErrorHandler(BurgerBuilder, axios);