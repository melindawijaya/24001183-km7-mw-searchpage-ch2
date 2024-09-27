function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Binar {
    static populateCars = (cars) => {
        return cars.map((car) => {
            const isPositive = getRandomInt(0, 1) === 1;
            const timeAt = new Date();
            const mutator = getRandomInt(1000000, 100000000);
            const availableAt = new Date(timeAt.getTime() + (isPositive ? mutator : -1 * mutator));

            return {
                ...car,
                availableAt,
            };
        });
    }

    static async listCars(filterer) {
        let cars;
        let cachedCarsString = localStorage.getItem("CARS");

        if (!!cachedCarsString) {
            const cacheCars = JSON.parse(cachedCarsString);
            cars = this.populateCars(cacheCars);
        } else {
            const response = await fetch(
                "https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json"
            );
            const body = await response.json();
            cars = this.populateCars(body);

            localStorage.setItem("CARS", JSON.stringify(cars));
        }

        // Filter sesuai fungsi filterer yang diberikan
        if (filterer instanceof Function) return cars.filter(filterer);

        return cars;
    }
}

// Fungsi untuk memfilter mobil sesuai input user (tipe driver, date, waktu, jumlah penumpang)
function filterCars(driverType, date, time, numberOfPassengers) {
    const selectedDate = new Date(`${date}T${time}`);

    return (car) => {
        // Filter driver (dengan atau tanpa supir)
        const driverMatch = driverType === car.availableDriver.toString();

        // Filter date dan waktu (apakah mobil tersedia pada waktu tersebut)
        const dateMatch = selectedDate >= new Date(car.availableAt);

        // Filter jumlah penumpang:
        // Jika jumlah penumpang diinputkan (tidak nol), hanya tampilkan mobil dengan kapasitas yang sama
        // Jika tidak diinputkan (jumlah penumpang kosong atau 0), tampilkan semua kapasitas
        const passengerMatch = numberOfPassengers > 0 ? car.capacity === numberOfPassengers : true;

        // Hanya menampilkan mobil yang memenuhi semua filter
        return driverMatch && dateMatch && passengerMatch;
    };
}

