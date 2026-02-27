const container = document.getElementById("grubContainer");
const modelGrub = document.getElementById("modelGrub");

function px(n) {
    return `${n}px`;
}

let grubs = [];
class Grub {
    moveTimer = 0;
    waitTimer = 0;

    dy = 0;

    constructor(x, y, onGround = false) {
        this.x = x;
        this.y = y;

        this.state = onGround ? "walking" : "falling";
        this.first = !onGround;

        this.direction = Math.random() < 1/2 ? 1 : -1;

        this.img = document.createElement("img");
        this.img.classList.add("grub");
        this.img.src = "../../assets/grubs/sad.png";
        this.img.style.position = "absolute";
        this.img.style.left = px(this.x);
        this.img.style.bottom = px(this.y);
        container.appendChild(this.img);

        grubs = grubs.concat(this);
    }

    update(dt) {
        if (this.state == "falling") {
            this.dy += 1 * (dt / 16.666);
            this.y -= this.dy * (dt / 16.666);

            if (this.y < 0) this.state = "walking";
        } else if (this.state == "walking") {
            if (this.moveTimer > 0) {
                this.x += (dt / 16) * this.direction;
                if (this.x + this.img.width > window.innerWidth || this.x < 0) {
                    this.flip(true);
                }

                this.moveTimer -= dt;
                this.moveTimer = Math.max(0, this.moveTimer);
            } else if (this.waitTimer > 0) {
                this.waitTimer -= dt;
                this.waitTimer = Math.max(0, this.waitTimer);
            } else {
                this.moveTimer = 4000 + (Math.random() * 6000);
                this.waitTimer = 4000 + (Math.random() * 3000);

                if (!this.first) {
                    if (Math.random() < 1 / 4) {
                        this.flip(false);
                    }
                }
                this.first = false;
            }
        }

        this.img.style.transform = `scaleX(${this.direction})`;

        if (this.x + this.img.width > window.innerWidth) this.x = window.innerWidth - this.img.width;
        if (this.x < 0) this.x = 0;

        if (this.y < 0) this.y = 0;

        this.img.style.left = px(this.x);
        this.img.style.bottom = px(this.y);
    }

    async flip(anim) {
        this.direction = 0 - this.direction;

        if (anim) {
            const flipTime = 75;

            this.img.src = "../../assets/grubs/flip1.png";
            await new Promise((resolve) => setTimeout(resolve, flipTime));
            this.img.src = "../../assets/grubs/flip2.png";
            await new Promise((resolve) => setTimeout(resolve, flipTime));
            this.img.src = "../../assets/grubs/flip3.png";
            await new Promise((resolve) => setTimeout(resolve, flipTime));
            this.img.src = "../../assets/grubs/flip4.png";
            await new Promise((resolve) => setTimeout(resolve, flipTime));
            this.img.src = "../../assets/grubs/flip5.png";
            await new Promise((resolve) => setTimeout(resolve, flipTime));
            this.img.src = "../../assets/grubs/sad.png";
        }
    }
}

// update loop
let start;
let last;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
        last = start;
    }
    const current = timestamp - start;
    const dt = current - last;

    grubs.forEach((grub) => {
        grub.update(dt);
    });

    last = current;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);

// grub spawning 
document.body.addEventListener("mousedown", (e) => {
    new Grub(e.clientX - modelGrub.width / 2, window.innerHeight - e.clientY - modelGrub.height / 4);
})

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("spawnGrubs")) {
    let n = urlParams.get("spawnGrubs");
    for (let i = 0; i < n; i++) new Grub(Math.random() * (window.innerWidth - 117), 0, true)
}