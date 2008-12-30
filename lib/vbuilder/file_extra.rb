#
# Joins the content of several files with a newline between
# TODO: Use Juicer API instead
#
def File.cat(*files)
  files = files[0] if files.respond_to?(:push)

  files.inject('') do |str, file|
    str += File.read(file) + "\n"
  end
end

#
# Merge files into a single minified file
# TODO: Use Juicer API instead
#
def File.merge(files, target, minify = true)
  tmp = "#{target}.tmp"
  tmp = target unless minify
  jar_dir = File.expand_path(File.join(File.dirname(__FILE__), '..'))
  type = target =~ /\.js$/ ? 'js' : 'css'

  # Write concatenated contents to tmp file
  File.open(tmp, 'w') { |f| f.puts(File.cat(files)) }

  # Minify with YUI Compressor
  `java -jar #{jar_dir}/yuicompressor-2.3.6.jar --charset latin1 --type #{type} -o #{target} #{tmp}` if minify

  # TMP: Correct YUIC mistake on regexes
  contents = File.read(target)

  File.open(target, 'w') do |file|
    contents.gsub!(/\(\^\|\\s\)/, "(^|\\\\\\s)")
    contents.gsub!(/\(\\s\|\$\)/, "(\\\\\\s|$)")

    license = <<EOF
/**
 * TERMS OF USE - Validatious 2.0
 * Open source under the BSD License.
 * Copyright 2008-2009 Christian Johansen.
 * All rights reserved.
 */
EOF

    file.puts license + contents
  end

  # Delete tmp file
  File.delete(tmp) if minify

  # Print confirmation
  if $verbose
    size = File::Stat.new(target).size / 1024.0
    puts "Produced #{target}, #{sprintf '%.2f' % size} kB"
  end
end
