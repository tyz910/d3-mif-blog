$(function () {
    d3.json('top100.json', function(data) {
        var svg = d3.select('svg');
        var width = +svg.attr('width');
        var height = +svg.attr('height');

        var pack = d3.pack()
            .size([width, height])
            .padding(2.5)
        ;

        var root = d3.hierarchy({children: data})
            .sum(function (d) {
                return d.rating;
            })
        ;

        var leaves = pack(root).leaves();

        var node = svg.selectAll('.node')
            .data(leaves)
            .enter()
            .append('g')
                .attr('class', 'node')
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
        ;

        var title = node.append('title')
            .text(function (d) {
                return d.data.post_title;
            })
        ;

        var img = node.append('image')
            .attr('xlink:href', function (d) {
                return d.data.thumb_min;
            })
            .attr('width', function (d) {
                return 2 * d.r;
            })
            .attr('height', function (d) {
                return 2 * d.r;
            })
            .attr('x', function (d) {
                return -d.r;
            })
            .attr('y', function (d) {
                return -d.r;
            })
            .attr('clip-path', 'url(#clipCircle)')
            .attr('preserveAspectRatio', 'xMidYMid slice')
        ;

        var cards = [];
        var idx = {};
        $.each(leaves, function (i, d) {
            var div = $('<div class="card-popup">').append(
                $('<a target="_blank" style="display: block;">').attr('href', d.data.url)
                    .append(
                        $('<div style="position: relative;">')
                            .append(
                                $('<div style="position: absolute; width: 100%;">')
                                    .append(
                                        $('<p class="card-text">' + d.data.post_title + '<br><span>' + d.data.subtitle +'</span>' + '</p>')
                                    )
                            )
                    )
                    .append(
                        $('<img>').attr('src', d.data.thumb)
                    )
            );

            cards.push({
                type: 'inline',
                src: div
            });

            idx[d.data.id] = i;
        });

        node.on('click', function (d) {
            $.magnificPopup.open({
                items: cards,
                closeBtnInside: true,
                gallery: {
                    enabled: true
                }
            }, idx[d.data.id]);
        });
    });
});
