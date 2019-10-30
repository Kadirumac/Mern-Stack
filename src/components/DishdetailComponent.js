import React, { Component } from 'react';
import { Card, CardImg,Col,Row, CardText, CardBody, CardTitle, BreadcrumbItem, Breadcrumb,Button,Label, Modal, ModalHeader, ModalBody } from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import{ Loading } from './LoadingComponent';
import { baseUrl }  from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

function RenderDish({dish}){
  return(
    <div className="col-12 col-md-5 m-1">
        <FadeTransform in 
                transformProps={{
                    exitTransform:'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                  <CardImg top src={baseUrl + dish.image} alt={dish.name}></CardImg>
                  <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                  </CardBody>
                </Card>     
      </FadeTransform>
    </div>
  );
}

class CommentForm extends Component{
  constructor(props){
    super(props);
    this.state={
      isModalOpen: false,
  
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
     
  }

 
handleInputChange(event){
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked: target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

handleSubmit(values){
  this.toggleComment();
  this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
}

handleBlur = (field) => (evt) => {
  this.setState({
    touched: { ...this.state.touched, [field]: true },
  });
}

  toggleComment = () =>{

    this.setState({isModalOpen: !this.state.isModalOpen})
  
  } 
  render(){
    return(
      <React.Fragment>
      <Modal isOpen={this.state.isModalOpen}>
        <ModalHeader>Submit Comment</ModalHeader>
          <ModalBody>
           <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
             <Row className="form-group">
              <Col md={10}>
                 <Label htmlFor="rating" md={4}>Rating</Label>
                    <Control.select model=".rating" name="rating " 
                        className="form-control">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                       </Control.select>
                    </Col>
                    
                    <Col md={10}>
                    <Label htmlFor="author" md={4}>Your Name</Label>
                        <Control.text model=".author" id="author" name="author"
                        placeholder="First Name"                                  
                        className="form-control"
                        validators={{
                            required, minLength: minLength(3), maxLength: maxLength(15)
                        }}
                        />

                          <Errors
                          className="text-danger"
                          model=".author"
                          show="touched"
                          messages={{
                              required:'Required',
                              minLength:'Must be greater than 2 characters',
                              maxLength:'Must be 15 characters or less'
                          }}/>
        
                       </Col>
                       </Row>      
                 
                        <Row className="form-group">
                            
                            <Col md={10}>
                            <Label htmlFor="comment" md={2}>Comment</Label>
                                <Control.textarea model=".comment" id="comment" name="message"
                                 rows="12"
                                className ="form-control" />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={2}>
                                <Button type="submit" color="primary" >
                                        Submit
                                </Button>
                            </Col>
                        </Row>
                  
                </LocalForm>
            </ModalBody>
          </Modal>
   <div className="row">    
   <Button outline onClick={this.toggleComment} >
       <span className="fa fa-pencil edit_click">  </span> Submit comment
   </Button> 
   </div>
   </React.Fragment>
  
   
    );
  }
}




function RenderComments({comments, postComment, dishId}){

  if(comments != null )
  return(
    <div className="col-12 col-md-5 m-1">
      <h4>Comments</h4>
      <ul className="list-unstyled">
        <Stagger in>
        {comments.map((comment) => {
          return (  
            <Fade in>   
                  <li key={comment.id}>
                      <p>{comment.comment}</p>
                      <p> --{ comment.author}, {new Date(comment.date).toLocaleTimeString()}</p>
                      <hr/> 
                  </li>  
           </Fade>      
          )
        })}
        </Stagger>
      </ul>
      <CommentForm dishId={dishId} postComment={postComment}></CommentForm>
    </div>
    
  );
  else 
  return(
    <div></div>
  );
}

const DishDetail = (props) => {
  if(props.isLoading){
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  else if(props.errMess){
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }

  if(props.dish != null)
   return(
     <div className="container">
          <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Link to='/home'>Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link to='/menu'>Menu</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                           {props.dish.name}
                        </BreadcrumbItem>
                    </Breadcrumb>
             
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                    </div>
                </div>
       <div className="row">
         <RenderDish dish={props.dish}/>
         <RenderComments comments={props.comments}
         postComment={props.postComment}
         dishId={props.dish.id}/>           
        
       </div>
 
     
     </div>
   );
else 
    return(
      <div></div>
    );
}


export default DishDetail;

/* 


class DishDetail extends Component {


  renderComments(dish) {
    if (dish.comments == null) {
      return (
        <div></div>
      )
    }

   
    const comments = dish.comments.map((comment) => {

      var d = new Date(comment.date).toDateString();
    
 
      return (
                 <div key={comment.id}>         
                              <p>{comment.author} <br></br>{d} <br></br>{comment.comment}</p>
                              
                        <hr></hr>
                     </div>
        ) ;
    });
    return comments;
  }

  render () {
    const dish = this.props.dish;
    if (dish == null) {
      return (
        <div></div>
      )
    }

    return (
      <div className="row">
        <div className="col-12 col-md-5 m-1">
          <Card>
            <CardImg width="100%" src={dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-12 col-md-5 m-1">
               <Card> <CardTitle>  <h4>Comments</h4></CardTitle>
              
                {this.renderComments(dish)}</Card>
        </div>
      </div>
    )
  }

}

export default DishDetail;
*/