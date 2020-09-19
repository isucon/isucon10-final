package main

import (
	"fmt"
	"os"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func getEnv(key, val string) string {
	if v := os.Getenv(key); v == "" {
		return val
	} else {
		return v
	}
}

func main() {
	srv := echo.New()
	srv.Debug = getEnv("DEBUG", "") != ""

	srv.Use(middleware.Logger())
	srv.Use(middleware.Recover())

	address := fmt.Sprintf(":%v", getEnv("PORT", "1323"))
	srv.Logger.Error(srv.Start(address))
}
