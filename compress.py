import os, os.path, shutil

YUI_COMPRESSOR = 'yuicompressor-2.4.7.jar'

def compress(in_files, out_file, in_type='js', verbose=False,
             temp_file='.temp'):
    temp = open(temp_file, 'w')
    for f in in_files:
        fh = open(f)
        data = fh.read() + '\n'
        fh.close()

        temp.write(data)

        print ' + %s' % f
    temp.close()

    options = ['-o "%s"' % out_file,
               '--type %s' % in_type]

    if verbose:
        options.append('-v')

    os.system('java -jar "%s" %s "%s"' % (YUI_COMPRESSOR,
                                          ' '.join(options),
                                          temp_file))

    org_size = os.path.getsize(temp_file)
    new_size = os.path.getsize(out_file)

    print '=> %s' % out_file
    print 'Original: %.2f kB' % (org_size / 1024.0)
    print 'Compressed: %.2f kB' % (new_size / 1024.0)
    print 'Reduction: %.1f%%' % (float(org_size - new_size) / org_size * 100)
    print ''


SCRIPTS = [
    'scripts/event_handler.js',
    'scripts/movable.js',
    'scripts/vector.js',
    'scripts/grid.js',
    'scripts/ball.js',
    'scripts/monster.js',
    'scripts/player.js',
    'scripts/game.js',
    'scripts/leaderboard.js',
    'scripts/controllers/game_controller.js',
    'scripts/controllers/score_controller.js',
    'scripts/controllers/scoreBoard_controller.js',
    'scripts/controllers/intro_controller.js',
    ]
SCRIPTS_OUT_DEBUG = 'scripts/multifarce.js'
SCRIPTS_OUT = 'scripts/multifarce.min.js'

STYLESHEETS = [
    'style/style.css',
    'style/reset.min.css',
    ]
STYLESHEETS_OUT = 'style/style.min.css'

def main():
    print 'Compressing JavaScript...'
    compress(SCRIPTS, SCRIPTS_OUT, 'js', False, SCRIPTS_OUT_DEBUG)

    print 'Compressing CSS...'
    compress(STYLESHEETS, STYLESHEETS_OUT, 'css')

if __name__ == '__main__':
    main()