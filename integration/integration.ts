import { readFileSync } from 'fs';
import { join } from 'path'
import { PostgresSchemaManager } from '../src/DataResourcesManager';
import { GraphQLBackendCreator, IGraphQLBackend } from "../src/GraphQLBackend";
import { KnexResolverManager } from "../src/ResolverManager";

const schemaText = readFileSync(join(__dirname, './Note.graphql'), 'utf8');
const backend = new GraphQLBackendCreator(schemaText, { generateGraphQLSchema: true, createDatabaseSchema: true })

// UI part
const connectionConfig = {
  'user': 'postgresql',
  'password': 'postgres',
  'database': 'memeolist_db',
  'host': '127.0.0.1',
  'port': '15432'
}

const manager = new PostgresSchemaManager(connectionConfig, 'test_');
backend.registerDataResourcesManager(manager);

const resolverManager = new KnexResolverManager('test_');
backend.registerResolverManager(resolverManager);

backend.createBackend().then((generated: IGraphQLBackend) => {
  console.error("Query")
  console.error(generated.schema)
  console.error("Resolvers")
  console.error(JSON.stringify(generated.resolvers, undefined, 4))

  // FIX ME add asserts
  manager.getConnection().schema.hasTable('test_note').then((exists: boolean) => {
    if (exists) {
      console.error("Schema created")
    }
  });
});

