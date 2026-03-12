<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Tomateo API",
    description: "API dokumentacija za aplikaciju za pracenje uzgoja paradajza"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local Docker server"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
class OpenApiSpec
{
}