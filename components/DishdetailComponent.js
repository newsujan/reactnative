import React, {Component} from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, SafeAreaView, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, addComment } from '../redux/ActionCreators';
import *as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment:(dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200 )
        return true;
      else
        return false;
    };

    const recognizeComment= ({ moveX, moveY, dx, dy }) => {
      if (dx > 200 )
        return true;
      else
        return false;
    };

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        return true;
      },
      onPanResponderGrant: () => {
        this.view.rubberBand(1000)
          .then(endState => console.log(endState.finished ? 'finished' : 'cancelled' ));
      },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState)){
          Alert.alert(
            'Add to Favorites?',
            'Are you sure you wish to add' + dish.name + 'to your favorites?',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel pressed'),
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}
              },
            ],
            { cancelable: false }
          );
        }
        if (recognizeComment(gestureState))
          props.onSelect();
        return true;
      },
  });

    if (dish != null) {
        return (
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>

            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}
                >
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={{flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                    <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#ff5500'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => props.onSelect()}
                        />
                </View>
            </Card>
          </Animatable.View>
        );
    }
    else {
        return (
            <View></View>
        );
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({item, index}) => {
        const formatDate = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(item.date));
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                      imageSize={12}
                      readonly
                      startingValue={item.rating}
                      style={{flexDirection:'row', justifyContent:'flex-start'}}
                    />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + formatDate}</Text>
            </View>
        );
    }

    return (
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card title="Comments">
            <FlatList data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
      </Animatable.View>
    );
}


class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    resetForm() {
        this.setState({
            rating: 0,
            author: '',
            comment: '',
            showModal: false
        });
    }

    handleComments(dishId) {
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onSelect = {() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={'fade'}
                    transparent={false}
                    visible = {this.state.showModal}
                    onDismiss={() => this.resetForm()}
                    onRequestClose={() => this.resetForm()}
                    >
                    <SafeAreaView>
                        <View style={styles.modal}>
                            <View >
                                <Rating
                                    showRating
                                    fractions={0}
                                    startingValue={5}
                                    imageSize= {40}
                                    onFinishRating={(rating) => this.setState({rating: rating})} />
                            </View>
                            <View >
                                <Input
                                    placeholder=' Author'
                                    leftIcon = {
                                        <Icon
                                            name='user-o'
                                            type='font-awesome'
                                            />
                                    }
                                    onChangeText = {(value) => this.setState({author: value})}
                                    />
                                <Input
                                    placeholder=' Comment'
                                    leftIcon = {
                                        <Icon
                                            name='comment-o'
                                            type='font-awesome'
                                            />
                                    }
                                    onChangeText = {(value) => this.setState({comment: value})}
                                    />
                            </View>
                            <View >
                                <Button color = "#512DA8"
	                                title = "SUBMIT"
	                                onPress = {() => this.handleComments(dishId)}
	                                />
                                <Button onPress = {() => this.setState({showModal: false})}
	                                color = "#989898"
	                                title = "CANCEL"
	                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
