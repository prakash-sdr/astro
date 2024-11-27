declare module 'swagger-jsdoc' {
    import { OpenAPIV3 } from 'openapi-types';

    interface SwaggerJSDocOptions {
        definition: OpenAPIV3.Document;
        apis: string | string[];
    }

    function swaggerJSDoc(options: SwaggerJSDocOptions): OpenAPIV3.Document;

    export = swaggerJSDoc;
}
