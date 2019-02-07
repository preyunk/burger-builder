import React, {Component} from 'react';
import Aux from '../../hoc/Auxilliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    meat: 1.3,
    cheese: 0.4
};
class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            meat: 0,
            bacon: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    };
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
        alert("You Continue !");
    };
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        // {salad: true, meat: false...}
        return (
            <Aux>

                <Burger ingredients={this.state.ingredients}/>
                <Modal showed={this.state.purchasing} modalClosed={this.purchaseCanceled}>
                    <OrderSummary ingredients={this.state.ingredients}
                    purchaseCanceled={this.purchaseCanceled}
                    purchaseContinued={this.purchaseContinue}/>
                </Modal>
                <BuildControls
                    price={this.state.totalPrice}
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                purchasable={this.state.purchasable}/>
            </Aux>
        );
    }
}
export default BurgerBuilder;