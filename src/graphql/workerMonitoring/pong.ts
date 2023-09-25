import {
  CustomMutationConfiguration,
  SequelizeModels,
} from 'graphql-sequelize-generator/types'
import { GraphQLBoolean, GraphQLObjectType } from 'graphql'
import { PubSub } from 'graphql-subscriptions'

const pongType = new GraphQLObjectType({
  name: 'pong',
  fields: {
    success: { type: GraphQLBoolean },
  },
})

export function pong(
  pubSubInstance: PubSub,
  models: SequelizeModels
): CustomMutationConfiguration {
  return {
    type: pongType,
    description: 'Pong the server.',
    args: {},
    resolve: async () => {
      try {
        await models.workerMonitoring.create({ status: 'pong' })
        pubSubInstance.publish('Ponged', { success: true })
        return { success: true }
      } catch (error) {
        console.error('Une erreur est survenue lors du ping:', error)
        return { success: false }
      }
    },
  }
}
