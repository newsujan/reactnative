import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet, Button, FlatList, Modal } from 'react-native';
import { Card, Icon, FormLabel, Input, Rating, AirbnbRating } from 'react-native-elements';
import  { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import {postFavorite, postComment, addComment} from '../redux/ActionCreators';

const mapStateToProps = state => {
  return{
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props){
  const dish = props.dish;

    if(dish != null) {
      return(
        <Card
          featuredTitle={dish.name}
          image={{ uri: baseUrl + dish.image}}>
          <Text style={{margin: 10}}>
            {dish.description}
          </Text>
          <View style={styles.formRow}>
            <Icon
              raised
              reverse
              name={props.favourite ? 'heart' : 'heart-o' }
              type='font-awesome'
              color='#f50'
              onPress={() => props.favourite ? console.log('Already favourite') : props.onPress()}
            />
            <Icon
              raised
              reverse
              name='pencil'
              type='font-awesome'
              color='#512DA8'
              onSelect={() => props.toggleModal()}
            />
          </View>
        </Card>
      );
    }
    else {
      return(<View></View>);
    }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index}) => {
    return(
      <View key={index} style={{margin:10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Text style={{fontSize: 12}}>{item.rating}</Text>
        <Text style={{fontSize: 12}}>{'--' + item.author + ',' + item.date}</Text>
      </View>
    );
  };
  return(
    <Card title='Comments'>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class Dishdetail extends Component{
  constructor(props){
    super(props);
    this.ratingComplete = this.ratingComplete.bind(this);
    this.toggleModal = this.toggleModal.bind(this);


    this.state = {
      showModal: false,
      favorites: [],
      rating: 3,
      author: '',
      comment: ''
    }
  }

  static navigationOptions = {
    title: 'Dish Details'
  }

  markFavourite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal(){
    this.setState({showModal: !this.state.showModal});
  }

  ratingComplete(rating) {
    //console.log("Rating is: " + this.state.userRating)
    this.setState({rating: rating})
  }

  handleSubmit(dishId){
    //console.log(dishId, rating, author, comment);
    this.toggleModal();
    this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
  }

  resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        });
  }


  render(){
    const dishId = this.props.navigation.getParam('dishId', '');

    return(
      <ScrollView>
        <RenderDish dish={this.props.dishes.dishes[+dishId]}
          favourite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavourite(dishId)}
          onSelect={() => this.toggleModal()}
        />
        <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {this.toggleModal()}}
          onRequestClose={() => {this.resetForm()}}
          >
            <View style={styles.modal}>
              <FormLabel style={styles.modalTitle}>Rating</FormLabel>
              <Rating showRating fractions="{1}" startingValue="{3.3}" />
              <Rating
                showRating
                type="star"
                fractions={1}
                startingValue={3}
                imageSize={40}
                style={{ paddingVertical: 10 }}
                onFinishRating={(rating) => this.setState({rating: rating})}
              />
              <Input
                placeholder='Author'
                leftIcon={
                  <Icon
                    name='user'
                    type='font-awesome'
                    color='#777'
                  />
                }
                onChangeText={ author => this.setState({ author: value })}
              />
              <Input
                placeholder='Comment'
                leftIcon={
                  <Icon
                    name='comment'
                    type='font-awesome'
                    color='#777'
                  />
                }
                onChangeText={ comment => this.setState({ comment: value })}
              />

              <Button
                onPress={() => {this.handleSubmit(dishId); this.resetForm();}}
                color='#512DA8'
                title='Submit'
                style={{marginTop: 10}}
                accessibilityLabel="Post your comment"
              />
              <Button
                onPress = {() =>{this.toggleModal(); this.resetForm();}}
                color='#777'
                title='Cancel'
                accessibilityLabel="Dismiss modal"
              />
            </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
