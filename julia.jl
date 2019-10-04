#!/usr/bin/env julia

using Electron, URIParser

asset(url...) = replace(normpath(joinpath(@__DIR__, "build", url...)), "\\" => "/")

app = Application()

win = Window(app, URI("file://$(asset("index.html"))"))

run(win, "addPlot(1)")
run(win, "addPlot(2)")