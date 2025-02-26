SWAGGER_URL=http://localhost:3000/api-json
npx @openapitools/openapi-generator-cli@latest generate -i $SWAGGER_URL -g typescript-axios -o ./src/api