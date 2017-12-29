(function() {
  var calcPop, col, data, grid, gridXSize, gridYSize, key, neighborsCount, pop, printObj, row, tile, updateData, viz, x, y, _i, _j, _k, _l, _len, _len1;

  gridXSize = 40;

  gridYSize = 20;

  grid = [];

  for (row = _i = 0; 0 <= gridYSize ? _i < gridYSize : _i > gridYSize; row = 0 <= gridYSize ? ++_i : --_i) {
    grid[row] = [];
    for (col = _j = 0; 0 <= gridXSize ? _j < gridXSize : _j > gridXSize; col = 0 <= gridXSize ? ++_j : --_j) {
      if (Math.round(Math.random() * 2) === 0) {
        grid[row][col] = true;
      } else {
        grid[row][col] = false;
      }
    }
  }

  data = [];

  for (y = _k = 0, _len = grid.length; _k < _len; y = ++_k) {
    row = grid[y];
    for (x = _l = 0, _len1 = row.length; _l < _len1; x = ++_l) {
      pop = row[x];
      tile = {
        x: x,
        y: y,
        pop: pop
      };
      key = y * gridXSize + x;
      data[key] = tile;
    }
  }

  neighborsCount = function(x, y) {
    var count;
    count = 0;
    if (y > 0) {
      if (grid[y - 1][x + 1]) {
        ++count;
      }
      if (grid[y - 1][x - 1]) {
        ++count;
      }
      if (grid[y - 1][x]) {
        ++count;
      }
    }
    if (y < gridYSize - 1) {
      if (grid[y + 1][x + 1]) {
        ++count;
      }
      if (grid[y + 1][x - 1]) {
        ++count;
      }
      if (grid[y + 1][x]) {
        ++count;
      }
    }
    if (grid[y][x + 1]) {
      ++count;
    }
    if (grid[y][x - 1]) {
      ++count;
    }
    return count;
  };

  calcPop = function(x, y) {
    var nbrs, p;
    nbrs = neighborsCount(x, y);
    if (grid[y][x]) {
      if ((1 < nbrs && nbrs < 4)) {
        p = true;
      } else {
        p = false;
      }
    } else {
      if (nbrs === 3) {
        p = true;
      } else {
        p = false;
      }
    }
    return p;
  };

  printObj = function(obj) {
    var arr, d, _len2, _m;
    arr = [];
    for (_m = 0, _len2 = obj.length; _m < _len2; _m++) {
      d = obj[_m];
      arr.push(d.pop);
    }
    return alert(arr);
  };

  viz = d3.select("#viz").append("svg:svg").attr("width", gridXSize * 20 + 1).attr("height", gridYSize * 20 + 1).selectAll("rect").data(data).enter().insert("svg:rect").style("stroke", "gray").style("fill", function(d) {
    if (d.pop) {
      return "purple";
    } else {
      return "white";
    }
  }).attr("x", function(d) {
    return d.x * 20 + 0.5;
  }).attr("y", function(d) {
    return d.y * 20 + 0.5;
  }).attr("width", 20).attr("height", 20);

  updateData = function() {
    var populated, updateGrid, _len2, _len3, _m, _n;
    updateGrid = [];
    for (y = _m = 0, _len2 = grid.length; _m < _len2; y = ++_m) {
      row = grid[y];
      updateGrid[y] = [];
      for (x = _n = 0, _len3 = row.length; _n < _len3; x = ++_n) {
        col = row[x];
        populated = calcPop(x, y);
        key = y * gridXSize + x;
        data[key].pop = populated;
        updateGrid[y][x] = populated;
      }
    }
    d3.select("#viz").selectAll("rect").data(data).style("fill", function(d) {
      if (d.pop) {
        return "purple";
      } else {
        return "white";
      }
    });
    return grid = updateGrid;
  };

  setInterval(updateData, 100);

}).call(this);
