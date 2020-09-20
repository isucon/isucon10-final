package main

import (
	"fmt"

	"github.com/isucon/isucon10-final/webapp/golang/util"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	srv := echo.New()
	srv.Debug = util.GetEnv("DEBUG", "") != ""

	srv.Use(middleware.Logger())
	srv.Use(middleware.Recover())

	srv.POST("/initialize", initialize)

	address := fmt.Sprintf(":%v", util.GetEnv("PORT", "9292"))
	srv.Logger.Error(srv.Start(address))
}

func initialize(c echo.Context) error {
	return nil
}
