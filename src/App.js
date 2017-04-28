import React, {
  Component
} from 'react';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import './App.css';
import 'normalize.css'
import './reset.css'
import UserDialog from './UserDialog'
import {
  getCurrentUser,
  signOut,
  adddata,
  modifydata,
  loadfromCloud
} from './leanCloud'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
  }
  render() {

    let todos = this.state.todoList.filter((item) => !item.deleted).map((item, index) => {
      return ( < li key = {
          index
        } >
        <
        TodoItem todo = {
          item
        }
        onToggle = {
          this.toggle.bind(this)
        }
        onDelete = {
          this.delete.bind(this)
        }
        /> </li >
      )
    })

    return ( < div className = "App" >
      <
      h1 > {
        this.state.user.username || '我'
      }
      的手账 {
        this.state.user.id ? < button onClick = {
            this.signOut.bind(this)
          } > 登出 < /button> : null} < /h1> <
          div className = "inputWrapper" >
          <
          TodoInput content = {
            this.state.newTodo
          }
        onChange = {
          this.changeTitle.bind(this)
        }
        onSubmit = {
          this.addTodo.bind(this)
        }
        /> </div > < ol className = "todoList" > {
          todos
        } < /ol> {
        this.state.user.id ? null : < UserDialog onSignUp = {
          this.onSignUpOrSignIn.bind(this)
        }
        onSignIn = {
          this.onSignUpOrSignIn.bind(this)
        }
        />} </div >
      )
    }

    signOut() {
      signOut()
      let stateCopy = CopyObj(this.state)
      stateCopy.user = {}
      stateCopy.todoList = []
      this.setState(stateCopy)
    }

    onSignUpOrSignIn(user) {
      let stateCopy = CopyObj(this.state)
      stateCopy.user = user
      this.setState(stateCopy)
      let setList = (con) => {
        let stateCopy = CopyObj(this.state)
        stateCopy.todoList = con
        this.setState(stateCopy)
      }
      loadfromCloud(setList);
    }
    componentWillMount() {


      let setList = (con) => {
        let stateCopy = CopyObj(this.state)
        stateCopy.todoList = con
        this.setState(stateCopy)
      }

      loadfromCloud(setList);
      //
    }
    componentDidUpdate() {
      if (!this.state.todoList.id) {
        let setOwner = (id) => {
          this.state.todoList.id = id
        }
        adddata(this.state.todoList, setOwner)
      } else {
        modifydata(this.state.todoList)
      }
    }
    changeTitle(event) {
      this.setState({
        newTodo: event.target.value,
        todoList: this.state.todoList
      })

    }
    toggle(e, todo) {
      todo.status = todo.status === 'completed' ? '' : 'completed'
      this.setState(this.state)

    }
    addTodo(event) {
      this.state.todoList.push({
        id: idMaker(),
        title: event.target.value,
        status: '',
        deleted: false
      })

      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })

    }
    delete(event, todo) {
      todo.deleted = true
      this.setState(this.state)

    }



  }

  export default App;
  let id = 0

  function idMaker() {
    id = 1
    return id
  }

  function CopyObj(obj) {
    return JSON.parse(JSON.stringify(obj))
  }