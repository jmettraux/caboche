
require 'rake'
require 'rake/clean'


LIBRARY =
  `pwd`.split('/').last.strip
LICENSE_URI =
  "http://github.com/jmettraux/#{LIBRARY}/LICENSE.txt"

CLOSURE_COMPILER_OPTIONS =
  '--warning_level DEFAULT'


#
# tasks

#CLEAN.include('pkg')
  # no cleaning for now

task :default => [ :clean ]

desc %q{
  packages/minifies the js files to pkg/
}
task :package => :clean do

  version = File.read(
    "js/#{LIBRARY}.js"
  ).match(
    / var VERSION *= *['"]([^'"]+)/
  )[1]

  sha = `git log -1 --format="%H"`.strip[0, 7]
  now = Time.now.to_s

  sh 'mkdir -p pkg'

  js_count = Dir['js/*.js'].length
    # don't create -all- files if there is only 1 js file

  Dir['js/*.js'].each do |path|

    fname = File.basename(path, '.js')

    FileUtils.cp(path, "pkg/#{fname}-#{version}.js")

    sh(
      "java -jar tools/google-closure-compiler.jar " +
      CLOSURE_COMPILER_OPTIONS +
      " --js #{path}" +
      " > pkg/#{fname}-#{version}.min.js")
  end

  sh(
    "cat js/*.js > pkg/#{LIBRARY}-all-#{version}.js"
  ) if js_count > 1

  sh(
    "java -jar tools/google-closure-compiler.jar " +
    CLOSURE_COMPILER_OPTIONS +
    " --js pkg/#{LIBRARY}-all-#{version}.js" +
    " > pkg/#{LIBRARY}-all-#{version}.min.js"
  ) if js_count > 1

  Dir["pkg/*-#{version}.min.js"].each do |path|

    fname = File.basename(path)

    header = "/* #{fname} | MIT license: #{LICENSE_URI} */\n"

    s = header + File.read(path)
    File.open(path, 'wb') { |f| f.print(s) }
  end

  Dir["pkg/*-#{version}.min.js"].each do |path|
    File.open(path, 'ab') { |f|
      f.puts("\n/* compressed from commit #{sha} on #{now} */\n")
    }
  end
  Dir["pkg/*-#{version}.js"].each do |path|
    File.open(path, 'ab') { |f|
      f.puts("\n/* from commit #{sha} on #{now} */\n")
    }
  end
end

desc %q{
  alias for 'package'
}
task :pkg => :package

desc %q{
  alias for 'package'
}
task :p => :package

desc %q{
  serve the current dir over HTTP for testing
}
task :serve do

  sh 'python -m SimpleHTTPServer 1234'
end

desc %q{
  alias for 'serve'
}
task :s => :serve

