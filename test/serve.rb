

require 'fileutils'
require 'webrick'

HERE = File.dirname(__FILE__)

FileUtils.cp(HERE + '/../js/caboche.js', HERE)

server = WEBrick::HTTPServer.new(:Port => 1234, :DocumentRoot => HERE)
trap('INT') { server.stop }
server.start

