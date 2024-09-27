class App {
    constructor() {
        this.clearButton = document.getElementById("clear-btn");
        this.loadButton = document.getElementById("load-btn");
        this.carContainerElement = document.getElementById("cars-container");
        this.tipeDriver = document.getElementById("tipeDriver");
        this.tanggal = document.getElementById("tanggal");
        this.waktuJemput = document.getElementById("waktuJemput");
        this.jumlahPenumpang = document.getElementById("jumlahPenumpang");

        this.tipeDriver.addEventListener('input', this.checkFields);
        this.tanggal.addEventListener('input', this.checkFields);
        this.waktuJemput.addEventListener('input', this.checkFields);
        this.jumlahPenumpang.addEventListener('input', this.checkFields);  // Opsional, tidak perlu mengaktifkan tombol

        // Inisialisasi tombol dalam keadaan disabled
        this.loadButton.disabled = true;
    }

    async init() {
        await this.load();
        this.run();
    }

    run = () => {
        Car.list.forEach((car) => {
            const node = document.createElement("div");
            node.classList.add("col-lg-4", "my-2");
            node.innerHTML = car.render();
            this.carContainerElement.appendChild(node);
        });
    };

    async load() {
        const cars = await Binar.listCars();
        Car.init(cars);
        console.log(cars);
    }

    async loadFilter() {
        const cars = await Binar.listCars((data) => {
            const tanggalJemputData = new Date(data.availableAt).getTime();
            const tanggal = new Date(`${this.tanggal.value}T${this.waktuJemput.value}`).getTime();

            const checkWaktu = tanggalJemputData >= tanggal;

            const availableAt = this.tipeDriver.value === 'true' && data.available;
            const notAvailableAt = this.tipeDriver.value === 'false' && !data.available;

            const jumlahPenumpangValue = this.jumlahPenumpang.value;

            const penumpang = jumlahPenumpangValue ? data.capacity === parseInt(jumlahPenumpangValue, 10) : true;

            return (availableAt || notAvailableAt) && checkWaktu && penumpang;
        });
        console.log(cars);
        Car.init(cars);
        this.clear();
        this.run();
    }

    clear = () => {
        let child = this.carContainerElement.firstElementChild;

        while (child) {
            child.remove();
            child = this.carContainerElement.firstElementChild;
        }
    };

    checkFields = () => {
        // Cek semua mandatory fields terisi
        const isTipeDriverFilled = this.tipeDriver.value !== 'default';
        const isTanggalFilled = this.tanggal.value !== '';
        const isWaktuJemputFilled = this.waktuJemput.value !== '';
        this.loadButton.disabled = !(isTipeDriverFilled && isTanggalFilled && isWaktuJemputFilled);
    };
}
