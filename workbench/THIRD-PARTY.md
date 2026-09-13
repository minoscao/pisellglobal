# Map data and implementation references

The Google Maps JavaScript API supplies the interactive base map. The local Pisell style uses Google embedded JSON style declarations: https://developers.google.com/maps/documentation/javascript/json-styling-overview

Country highlights use Natural Earth 1:50m Admin 0 country outlines, downloaded 13 September 2026 from https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson . Local copy retains geometry rounded to four decimal places, English names, stable codes and label anchors. Natural Earth data is public domain: https://www.naturalearthdata.com/about/terms-of-use/ . The boundaries are for a country-level overview, not precise local coverage.

Coloring is calculated from current authenticated venue and exhibition records and the selected project collection. Country color does not establish an office, branch, full research coverage or an operational presence level.
