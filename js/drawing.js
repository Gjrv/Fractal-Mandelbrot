var canvas  = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    size    = canvas.width = canvas.height = 630,
    img     = context.createImageData(size, size),
    pix     = img.data,
    zoom    = 1,
    mouseX  = 0,
    mouseY  = 0;

var xmin = -2.0, xmax = 2.0,
    ymin = -2.0, ymax = 2.0;

var parametrs = {
    maxIt : 100,
    R : 4,
    C : new Complex(-0.072, 0.67)
}, x, y;

function Complex(x,y){
    this.x = x || 0;
    this.y = y || 0;
}

Complex.prototype.Pow5 = function() {
    return new Complex(Math.pow(this.x, 5) - 10 * Math.pow(this.x, 3) * Math.pow(this.y, 2) + 5 * this.x * Math.pow(this.y, 4),
        5 * Math.pow(this.x, 4) * this.y - 10 * Math.pow(this.x, 2) * Math.pow(this.y, 3) + Math.pow(this.y,5));
};
Abs = function(cmx) {
    return Math.sqrt((cmx.x*cmx.x) + (cmx.y*cmx.y));
};
Add = function(cmx1,cmx2) {
    return new Complex(1.0 * (cmx1.x + cmx2.x), 1.0 * (cmx1.y + cmx2.y));
};
draw = function() {
    for (var ky = 0; ky < size; ky++) {
        y = ymin + (ymax - ymin) * ky / size;
        for (var kx = 0; kx < size; kx++) {
            x = xmin + (xmax - xmin) * kx / size;
            var z = new Complex(x / zoom + mouseX / size, y / zoom + mouseY / size);
            for (var i = 0; i < parametrs.maxIt; i++) {
                if (Abs(z) > 2) {
                    break;
                }
                z = Add(z.Pow5(), parametrs.C);
            }
            var p = (size * ky - kx) * 4;
            pix[p] = i % 256 * 6;
            pix[p + 1] = i % 256 * 10;
            pix[p + 2] = i % 256 * 18;
            pix[p + 3] = 255;
        }
    }
    context.putImageData(img, 0, 0);
}
$(function(){
    $(".btn").click(function() {
        parametrs.maxIt = $(".operation")[0].value;
        parametrs.R = $(".radius")[0].value;
        parametrs.C = new Complex($(".re")[0].value, $(".im")[0].value);
        draw();
    });
    $('canvas').mousedown(function(event){
        event.preventDefault();
        if(event.button == 0){
            zoom++;
        }
         if(event.button == 2){
           zoom--;
        }
        draw();
    });
    document.onkeypress = function(event) {
        var keycode;
        if (!event)
            var event = window.event;
        if (event.keyCode)
            keycode = event.keyCode;
        else if (event.which)
            keycode = event.which;
        switch (keycode) {
            case 119:
                mouseY -= 50;
                break;
            case 115:
                mouseY += 50;
                break;
            case 97:
                mouseX += 50;
                break;
            case 100:
                mouseX -= 50;
                break;
        }
        draw();
    }
});
draw();
