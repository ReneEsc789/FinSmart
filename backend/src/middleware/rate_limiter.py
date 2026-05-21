from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI
from fastapi.responses import JSONResponse

limiter = Limiter(key_func = get_remote_address)

def setup_rate_limiter(app: FastAPI):
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request, exc):
        return JSONResponse (
            status_code= 429,
            content = {"detail": "Demasiadas solicitudes, intente mas tarde."}
        )
    
    return limiter