YUI.add('imageloaded', function (Y) {
    var imageLoaded = function (el, cb)
    {
        var images = this.all('img');
        var count = images.size();
        if (count == 0) cb();
        images.each(function(img){
            var image = new Image();
            image.onload = function(e){
                count --;
                if (count == 0) cb()
            }
            image.onerror = function(e){
                count --;
                if (count == 0) cb()
            }
            image.src = img.getAttribute('src');
        })
    }
    Y.Node.addMethod("imageLoaded", imageLoaded);
    Y.NodeList.importMethod(Y.Node.prototype, "imageLoaded");
}, '0.0.1', { requires: ['node'] });

YUI.add('gridify', function (Y) {
    var gridify = function (el, options)
    {
        var self = this,
            options = options || {},
            transition = (options.transition || 'all 0.5s ease') + ', height 0, width 0',
            indexOfSmallest = function (a) {
                var lowest = 0;
                for (var i = 1; i < a.length; i++) {
                    if (a[i] < a[lowest]) lowest = i;
                }
                return lowest;
            },
            render = function ()
            {
                self.setStyle('position', 'relative');
                var items = self.all(options.srcNode),
                    width = self.get('clientWidth'),
                    item_margin = parseInt(options.margin || 0),
                    item_width = parseInt(options.max_width || options.width || 220),
                    column_count = Math.max(Math.floor(width/(item_width + item_margin)),1),
                    left = column_count == 1 ? -item_margin/2 : (width % (item_width + item_margin)) / 2,
                    columns = [];
                if (options.max_width)
                {
                    column_count = Math.ceil(width/(item_width + item_margin));
                    item_width = (width - column_count * item_margin - item_margin)/column_count;
                    left = item_margin/2;
                }
                for (var i = 0; i < column_count; i++)
                {
                    columns.push(0);
                }
                items.each(function(item) {
                    var i = indexOfSmallest(columns);
                    item.setStyles({
                        width: item_width,
                        position: 'absolute',
                        margin: item_margin/2,
                        top: columns[i] + item_margin/2,
                        left: (item_width + item_margin) * i + left,
                        transition: transition
                    });
                    columns[i] += item.get('clientHeight') + item_margin;
                });
            };
        render();
        self.imageLoaded(function(){setTimeout(render, 200)});
        if (options.resizable)
        {
            var resize = Y.on('resize', function(){
                render();
                if(options.max_width) setTimeout(render, 200);
            });
            self.on('destroy', resize.detach, self);
        }
    }
    Y.Node.addMethod("gridify", gridify);
    Y.NodeList.importMethod(Y.Node.prototype, "gridify");
}, '0.0.1', { requires: ['node', 'imageloaded'] });
