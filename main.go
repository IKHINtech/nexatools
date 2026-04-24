package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	appbootstrap "nexatools/internal/app"
	"nexatools/internal/bindings"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	bootstrap, err := appbootstrap.NewBootstrap()
	if err != nil {
		log.Fatal(err)
	}
	app := bindings.New(bootstrap)

	err = wails.Run(&options.App{
		Title:  "NexaTools",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
