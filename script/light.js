(function() {
  var cast_light, col, data, do_fov, grid, gridXSize, gridYSize, is_blocked, lSCount, light, lightSources, mult, refreshDataArray, removeLightSource, row, updateData, viz, viz_bg, _i, _j;

  gridXSize = 40;

  gridYSize = 31;

  lightSources = {};

  grid = [];

  for (row = _i = 0; 0 <= gridYSize ? _i < gridYSize : _i > gridYSize; row = 0 <= gridYSize ? ++_i : --_i) {
    grid[row] = [];
    for (col = _j = 0; 0 <= gridXSize ? _j < gridXSize : _j > gridXSize; col = 0 <= gridXSize ? ++_j : --_j) {
      grid[row][col] = {
        x: col,
        y: row,
        lighting: {}
      };
      if (Math.round(Math.random() * 3) === 0) {
        grid[row][col].type = "wall";
      } else {
        grid[row][col].type = "floor";
      }
    }
  }

  removeLightSource = function(id) {
    var tile, _k, _len, _results;
    _results = [];
    for (_k = 0, _len = grid.length; _k < _len; _k++) {
      row = grid[_k];
      _results.push((function() {
        var _l, _len1, _results1;
        _results1 = [];
        for (_l = 0, _len1 = row.length; _l < _len1; _l++) {
          tile = row[_l];
          _results1.push(tile.lighting[id] = null);
        }
        return _results1;
      })());
    }
    return _results;
  };

  mult = [[1, 0, 0, -1, -1, 0, 0, 1], [0, 1, -1, 0, 0, -1, 1, 0], [0, 1, 1, 0, 0, -1, -1, 0], [1, 0, 0, 1, -1, 0, 0, -1]];

  is_blocked = function(x, y) {
    if (x <= 0 || x >= gridXSize - 1 || y <= 0 || y >= gridYSize - 1) {
      return true;
    } else if (grid[y][x].type === "wall") {
      return true;
    } else {
      return false;
    }
  };

  light = function(x, y, ox, oy, radius, id) {
    var dist;
    dist = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy));
    if (dist > radius) {
      return;
    }
    if (!grid) {
      return;
    }
    if (!grid[y]) {
      return;
    }
    if (!grid[y][x]) {
      return;
    }
    return grid[y][x].lighting[id] = (radius - dist) / radius * 1.5;
  };

  do_fov = function(start_x, start_y, radius, id) {
    var oct, _k, _results;
    if (lightSources[id]) {
      removeLightSource(id);
    }
    lightSources[id] = true;
    light(start_x, start_y, start_x, start_y, radius, id);
    _results = [];
    for (oct = _k = 0; _k <= 7; oct = ++_k) {
      _results.push(cast_light(start_x, start_y, 1, 1.0, 0.0, radius, mult[0][oct], mult[1][oct], mult[2][oct], mult[3][oct], id));
    }
    return _results;
  };

  cast_light = function(cx, cy, row, light_start, light_end, radius, xx, xy, yx, yy, id) {
    var blocked, dx, dy, j, l_slope, mx, my, new_start, r_slope, radius_sq, _k, _results;
    if (light_start < light_end) {
      return;
    }
    radius_sq = radius * radius;
    _results = [];
    for (j = _k = row; row <= radius ? _k <= radius : _k >= radius; j = row <= radius ? ++_k : --_k) {
      dx = -j - 1;
      dy = -j;
      blocked = false;
      while (dx <= 0) {
        dx += 1;
        mx = cx + dx * xx + dy * xy;
        my = cy + dx * yx + dy * yy;
        if (isNaN(my)) {
          alert("" + cy + " + " + dx + " * " + yx + " + " + dy + " * " + yy);
        }
        l_slope = (dx - 0.5) / (dy + 0.5);
        r_slope = (dx + 0.5) / (dy - 0.5);
        if (light_start < r_slope) {
          continue;
        } else if (light_end > l_slope) {
          break;
        } else {
          if ((dx * dx + dy * dy) < radius_sq) {
            light(mx, my, cx, cy, radius, id);
          }
          if (blocked) {
            if (is_blocked(mx, my)) {
              new_start = r_slope;
              continue;
            } else {
              blocked = false;
              light_start = new_start;
            }
          } else {
            if (is_blocked(mx, my) && j < radius) {
              blocked = true;
              cast_light(cx, cy, j + 1, light_start, l_slope, radius, xx, xy, yx, yy, id);
              new_start = r_slope;
            }
          }
        }
      }
      if (blocked) {
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  data = [];

  refreshDataArray = function() {
    var index, tile, _k, _len, _results;
    index = 0;
    _results = [];
    for (_k = 0, _len = grid.length; _k < _len; _k++) {
      row = grid[_k];
      _results.push((function() {
        var _l, _len1, _results1;
        _results1 = [];
        for (_l = 0, _len1 = row.length; _l < _len1; _l++) {
          tile = row[_l];
          data[index] = tile;
          _results1.push(++index);
        }
        return _results1;
      })());
    }
    return _results;
  };

  refreshDataArray();

  viz_bg = d3.select("#viz_bg").append("svg:svg").attr("width", gridXSize * 20 + 1).attr("height", gridYSize * 20 + 1).selectAll("rect").data(data).enter().insert("svg:rect").style("stroke", "gray").style("fill", function(d) {
    if (d.type === "wall") {
      return "red";
    } else {
      return "white";
    }
  }).attr("x", function(d) {
    return d.x * 20 + 0.5;
  }).attr("y", function(d) {
    return d.y * 20 + 0.5;
  }).attr("width", 20).attr("height", 20);

  lSCount = 2;

  viz = d3.select("#viz").append("svg:svg").attr("width", gridXSize * 20 + 1).attr("height", gridYSize * 20 + 1).selectAll("rect").data(data).enter().insert("svg:rect").style("stroke", "gray").style("fill", "black").style("opacity", function(d) {
    var lighting, val;
    lighting = 0;
    for (val in d.lighting) {
      lighting += d.lighting[val];
    }
    return 1 - lighting;
  }).attr("x", function(d) {
    return d.x * 20 + 0.5;
  }).attr("y", function(d) {
    return d.y * 20 + 0.5;
  }).attr("width", 20).attr("height", 20).on("click", function(d) {
    do_fov(d.x, d.y, Math.round(Math.random() * 5 + 3), lSCount);
    ++lSCount;
    return updateData();
  }).on("mouseover", function(d) {
    do_fov(d.x, d.y, 10, 1);
    return updateData();
  });

  updateData = function() {
    refreshDataArray();
    return d3.select("#viz").selectAll("rect").data(data).style("opacity", function(d) {
      var lighting, val;
      lighting = 0;
      for (val in d.lighting) {
        lighting += d.lighting[val];
      }
      if (lighting > 1) {
        lighting = 1;
      }
      return 1 - lighting;
    });
  };

}).call(this);
