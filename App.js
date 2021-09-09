import React, { Component } from 'react'
import {View, Text, TextInput, FlatList, KeyboardAvoidingView} from 'react-native'
import io from 'socket.io-client'

const FL = React.createRef();

const randomKeyGenerator = (length) => {
      const key           = [];
      const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      for ( var i = 0; i < length; i++ ) {
          key.push(characters.charAt(Math.floor(Math.random() * characters.length)));
      }
      const keyString = key.join("");
      return keyString;
  }

export class App extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      user: `u-${randomKeyGenerator(6)}`,
      message: "",
      messages: []
    }
  }
  

  componentDidMount(){

    this.socket = io("http://192.168.4.41:3000");
    this.socket.on('ack', msg => console.log(msg))
    this.socket.on('messaging', async msg => {
      const {messages} = this.state
      this.setState({messages: [...messages, msg]}, () => setTimeout(() => FL.current.scrollToEnd(), 300));
	  
    })
  }

  onSubmit = () => {

    const {message, user} = this.state
    if(message !== ""){
      this.socket.emit('messaging', {
        user: user,
        msg: message,
        time: `${("0" + (new Date()).getHours()).slice(-2)}:${("0" + (new Date()).getMinutes()).slice(-2)}`
      });
      this.setState({message: ""})
    }
  }

  render() {

    const {message, messages, user} = this.state;
     
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{flex: 1, backgroundColor: 'green'}}
        >
        <Text style={{textAlign: 'center', marginVertical: 32, color: '#FFFFFF', fontSize: 18}}>Testing Socket IO Client</Text>
        <View style={{flex: 1, margin: 16}}>
          <Text style={{marginHorizontal: 16, color: '#FFFFFF', fontSize: 14}}>User: {user}</Text>
          <View style={{flex: 1, marginVertical: 16, backgroundColor: '#dedede', borderRadius: 18, paddingVertical: 4, paddingHorizontal: 8}}>
            <FlatList 
				ref={FL}
				data={messages}
				style={{paddingBottom: 8}}
				renderItem={({item, index}) => (
					<View style={{minHeight: 24, padding: 4, paddingHorizontal: 12, justifyContent: 'center', alignSelf: item.user === user ? 'flex-end' : 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 100, marginVertical: 4}} key={index.toString()}>
					<Text>{item.msg}</Text>
					<Text style={{fontSize: 8, color: '#767676', fontStyle: 'italic', textAlign: item.user === user ? 'right' : 'left'}}>{`By ${item.user} • ${item.time}`}</Text>
					</View>
				)}
				showsVerticalScrollIndicator={false}
				/>
          </View>

          <View style={{height: 40, backgroundColor: '#FFF', borderRadius: 100}}>
            <TextInput 
              value={message}
              onChangeText={(text) => this.setState({message: text})}
              style={{flex: 1, paddingHorizontal: 16}}
              placeholder="Type a message ..."
              onSubmitEditing={this.onSubmit}
              blurOnSubmit={false}
              placeholderTextColor="#767676"
              returnKeyType="send"
              returnKeyLabel="Kirim"
              />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

export default App
