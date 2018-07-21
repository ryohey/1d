import Point from "./Point"

function equals(a, b) {
    expect(b).toEqual(a)
}

test('new Point(10, 20)', function() {
  var point = new Point(10, 20);
  equals(point.x, 10, 'point.x');
  equals(point.y, 20, 'point.y');
});

test('new Point([10, 20])', function() {
  var point = new Point([10, 20]);
  equals(point.x, 10, 'point.x');
  equals(point.y, 20, 'point.y');
});

test('new Point({x: 10, y: 20})', function() {
  var point = new Point({ x: 10, y: 20 });
  equals(point.x, 10, 'point.x');
  equals(point.y, 20, 'point.y');
});

test('new Point(new Size(10, 20))', function() {
  equals(new Point(new Size(10, 20)), new Point(10, 20));
});

test('new Point({ width: 10, height: 20})', function() {
  equals(new Point({width: 10, height: 20}), new Point(10, 20));
});

test('new Point({ angle: 45, length: 20})', function() {
  equals(new Point({ angle: 40, length: 20 }), new Point(15.32089, 12.85575));
});

test('new Point("10, 20")', function() {
  equals(new Point('10, 20'), new Point(10, 20));
  equals(new Point('10,20'), new Point(10, 20));
  equals(new Point('10 20'), new Point(10, 20));
  // Make sure it's integer values from the string:
  equals(new Point('10 20').add(10), new Point(20, 30));
});

test('normalize(length)', function() {
  var point = new Point(0, 10).normalize(20);
  equals(point, new Point(0, 20));
});

test('set length', function() {
  var point = new Point(0, 10);
  point.length = 20;
  equals(point, new Point(0, 20));
});

test('get angle', function() {
  var angle = new Point(0, 10).angle;
  equals(angle, 90);
});

test('getAngle(point)', function() {
  var angle = new Point(0, 10).getAngle([10, 10]);
  equals(Math.round(angle), 45);
});

test('rotate(degrees)', function() {
  var point = new Point(100, 50).rotate(90);
  equals(point, new Point(-50, 100));
});

test('set angle', function() {
  var point = new Point(10, 20);
  point.angle = 92;
  equals(point.angle, 1.5);
  equals(point, new Point({
    angle: 1.5,
    length: Math.sqrt(10 * 10 + 20 * 20)
  }));
});

test('set angle & length', function() {
  var point1 = new Point();
  point1.length = Math.SQRT2;
  point1.angle = -45;

  var point2 = new Point();
  point2.angle = -45;
  point2.length = Math.SQRT2;

  equals(point2, point1);
});

test('getting angle after x / y change', function() {
  var vector = new Point(1, 0);
  equals(vector.angle, 0, 'angle before x / y change');
  vector.x = 0;
  vector.y = 1;
  equals(vector.angle, Math.PI / 2, 'angle after x / y change');
});

test('equals()', function() {
  equals(new Point(10, 10).equals(new Point(10, 10)), true);
  equals(new Point(0, 0).equals({}), false);
  equals(new Point(0, 0).equals(null), false);
});
