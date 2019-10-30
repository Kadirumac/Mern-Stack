import React, { Component } from 'react';
import DishDetail from './DishdetailComponent';
import Home from './homeComponent';
import Menu from './menuComponent';
import Contact from './contactComponent';
import About from './AboutComponent';
import Header from './headerComponent';
import Footer from './footerComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos , fetchLeaders, postFeedback} from '../redux/ActionCreators';

import {TransitionGroup, CSSTransition} from 'react-transition-group';

const mapStateToProps = state => {
    return{
      dishes: state.dishes,
      comments: state.comments,
      leaders: state.leaders,
      promotions: state.promotions
    }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  fetchDishes: () => {dispatch(fetchDishes())},
  fetchComments: () => {dispatch(fetchComments())},
  fetchPromos: () => {dispatch(fetchPromos())},
  fetchLeaders: () => {dispatch(fetchLeaders())},
  postFeedback : (firstname,lastname,telnum,email,aggree,contactType,message) => {dispatch(postFeedback(firstname,lastname,telnum,email,aggree,contactType,message))}

});

class Main extends Component {

  state= {
    isModalOpen: false
  };

  componentDidMount(){
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.postFeedback();
  }

toggleComment = () =>{

  this.setState({isModalOpen: !this.state.isModalOpen})
  console.log(this.state.isModalOpen);
}

  render() {

    const HomePage = () => {
      return(
        
        <Home
         dish={this.props.dishes.dishes.filter((dish)=> dish.featured)[0]}
        dishesLoading={this.props.dishes.isLoading}
        dishesErrMess={this.props.dishes.errMess}
        promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
        promosLoading={this.props.promotions.isLoading}
        promosErrMess={this.props.promotions.errMess}
        leader={this.props.leaders.leaders.filter((leader)=>leader.featured)[0]}
        leadersLoading={this.props.leaders.isLoading}
        leadersErrMess={this.props.leaders.errMess}
        />
      );
    }

    const DishwithId = ({match}) => {
        return(
          <DishDetail 
          togCom={this.toggleComment.bind(this)}
          dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
          commentsErrMess={this.props.comments.errMess}
          postComment = {this.props.postComment}

          />
        );
    }
    return (
      <div>
        <Header /> 
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch>
                <Route path="/home" component={HomePage} />
                <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} />} />
                <Route path="/menu/:dishId" component={DishwithId}></Route>
                <Route exact path="/contact" component={() => <Contact postFeedback={this.props.postFeedback}/>}></Route>
                <Route exact path="/about" component={ () => <About leaders={this.props.leaders}/> } />
                <Redirect to="/home" />
            </Switch>
            </CSSTransition>
        </TransitionGroup>
        <Footer/>
        
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));