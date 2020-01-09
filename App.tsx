import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';

import API, {GraphQLResult, graphqlOperation} from '@aws-amplify/api';
import {listTodos, getTodo} from './src/graphql/queries';
import {createTodo, updateTodo, deleteTodo} from './src/graphql/mutations';
import * as APIt from './src/API';

type Todo = Omit<Exclude<APIt.GetTodoQuery['getTodo'], null>, '__typename'>;

async function accessAPI() {
  let id: string = '';
  // Create GraphQL Mutation
  const createI: APIt.CreateTodoInput = {
    name: 'create name',
    description: 'create description',
  };
  const createMV: APIt.CreateTodoMutationVariables = {
    input: createI,
  };
  const createR: GraphQLResult<APIt.CreateTodoMutation> = await API.graphql(
    graphqlOperation(createTodo, createMV),
  );
  if (createR.data) {
    const createTM: APIt.CreateTodoMutation = createR.data;
    if (createTM.createTodo) {
      const todo: Todo = createTM.createTodo;
      console.log('CreateTodo', todo);
      id = createTM.createTodo.id;
    }
  }
  // Update GraphQL Mutation
  const updateI: APIt.UpdateTodoInput = {id, description: 'update description'};
  const updateMV: APIt.UpdateTodoMutationVariables = {
    input: updateI,
  };
  const updateR: GraphQLResult<APIt.UpdateTodoMutation> = await API.graphql(
    graphqlOperation(updateTodo, updateMV),
  );
  if (updateR.data) {
    const updateTM: APIt.UpdateTodoMutation = updateR.data;
    if (updateTM.updateTodo) {
      const todo: Todo = updateTM.updateTodo;
      console.log('UpdateTodo:', todo);
    }
  }
  // Get GraphQL Query
  const getQV: APIt.GetTodoQueryVariables = {id};
  const getGQL: GraphQLResult<APIt.GetTodoQuery> = await API.graphql(
    graphqlOperation(getTodo, getQV),
  );
  if (getGQL.data) {
    const getQ: APIt.GetTodoQuery = getGQL.data;
    if (getQ.getTodo) {
      const todo: Todo = getQ.getTodo;
      console.log('GetTodo:', todo);
    }
  }
  // List GraphQL Query
  const listQV: APIt.ListTodosQueryVariables = {};
  const listGQL: GraphQLResult<APIt.ListTodosQuery> = await API.graphql(
    graphqlOperation(listTodos, listQV),
  );
  if (listGQL.data) {
    const listQ: APIt.ListTodosQuery = listGQL.data;
    if (listQ.listTodos && listQ.listTodos.items) {
      listQ.listTodos.items.forEach((item: Todo | null) => {
        if (item) {
          const todo: Todo = item;
          console.log('ListTodo:', todo);
        }
      });
    }
  }
  // Delete GraphQL Mutation
  const deleteI: APIt.DeleteTodoInput = {id};
  const deleteMV: APIt.DeleteTodoMutationVariables = {
    input: deleteI,
  };
  const deleteR: GraphQLResult<APIt.DeleteTodoMutation> = await API.graphql(
    graphqlOperation(deleteTodo, deleteMV),
  );
  if (deleteR.data) {
    const deleteTM: APIt.DeleteTodoMutation = deleteR.data;
    if (deleteTM.deleteTodo) {
      const todo: Todo = deleteTM.deleteTodo;
      console.log('DeleteTodo:', todo);
    }
  }
}

function App() {
  useEffect(() => {
    accessAPI();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>TypeScript API Demo</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
});

export default App;
