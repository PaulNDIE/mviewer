{
    mviewer.customLayers.cluster = {};
    var cl = mviewer.customLayers.cluster;
    var uniqueStyle = [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'rgba(231, 76, 60, 0.7)'
                })
            })
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: 'rgba(236, 240, 241,7.0)'
                })
            })
        })
    ];

    var clusterStyle = function(feature) {
        var size = feature.get('features').length;
        if (size == 1) {
            return uniqueStyle;
        } else {
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 20,
                        fill: new ol.style.Fill({
                            color: 'rgba(236, 240, 241,0.7)'
                        })
                    })
                }),
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 15,
                        fill: new ol.style.Fill({
                            color: 'rgba(231, 76, 60, 0.7)'
                        })
                    }),
                    text: new ol.style.Text({
                        font: '12px roboto_regular, Arial, Sans-serif',
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff'
                        })
                    })
                })
            ];
        }

    };

    cl.layer = new ol.layer.Vector({
        source: new ol.source.Cluster({
            distance: 40,
            source: new ol.source.Vector({
                url: "https://geobretagne.fr/geoserver/dreal_b/wfs?service=WFS&version=1.0.0&request=GetFeature&typeNames=dreal_b:projets-environnement-diffusion&outputFormat=application/json&srsName=EPSG:4326&bbox=-6,47,0,49",
                format: new ol.format.GeoJSON()
            })
        }),
        style: clusterStyle

    });
    cl.handle = function(clusters, views) {
        if (clusters.length > 0 && clusters[0].properties.features) {
            var features = clusters[0].properties.features;
            var elements = [];
            var l = mviewer.getLayer("cluster");
            features.forEach(function(feature, i) {
                elements.push({
                    properties: feature.getProperties()
                });
            });
            var html;
            if (l.template) {
                html = info.templateHTMLContent(elements, l);
            } else {
                html = info.formatHTMLContent(elements, l);
            }
            var view = views["right-panel"];
            view.layers.push({
                "id": view.layers.length + 1,
                "firstlayer": true,
                "manyfeatures": (features.length > 1),
                "nbfeatures": features.length,
                "name": l.name,
                "layerid": "cluster",
                "theme_icon": l.icon,
                "html": html
            });
        }

    };
}