
{
	const db_name = 'IndexedDB_Storage';

	class IndexedDB_Storage {
		constructor() {
			this.status = 0;//-1 is open error,0 is not open, 1 is opening, 2 is opened
			this.c_task = null;
			this.wait_task = null;
		}

		open_db() {
			if (this.status > 0) {
				return Promise.resolve({instance : this});
			}
			let request = indexedDB.open(db_name, 1);
			let promise = new Promise((resolve, reject) => {
				this.status = 1;
				request.onerror = (e) => {
					this.status = -1;
					reject({
						e : e,
						instance : this
					});
				}
				request.onsuccess = (e) => {
					this.db = e.target.result;
					this.status = 2;
					resolve({
						e : e,
						instance : this
					});
				}
				request.onupgradeneeded = (e) => {
					this.db = e.target.result;
					let objectStore = this.db.createObjectStore("localStorage", {keyPath: "key"});
					objectStore.transaction.oncomplete = (e) => {
						this.status = 2;
						resolve({
							e : e,
							instance : this
						});
					}
					objectStore.transaction.onerror = (e) => {
						this.status = -1;
						reject({
							e : e,
							instance : this
						});
					}
				}
			});
			return promise;
		}
		
		//
		getItem(n) {
			let promise;
			let transaction = this.db.transaction(['localStorage'], 'readonly');
			let objectStore = transaction.objectStore('localStorage');
			let request = objectStore.get(n);
			promise = new Promise((resolve, reject) => {
				request.onsuccess = (e) => {
					let r = e.target.result;
					console.log(r);
					resolve(r.value);
				}
				request.onerror = (e) => {
					console.log(e);
					reject(e);
				}
				transaction.onerror = (e) => {
					reject(e);
				}
			});
			return promise;
		}
		//
		setItem(n, v) {
			console.log('setItem ' + n);
			console.log(v);
			console.log(this);
			let h = null;
			let self = this;
			let f = function* (resolve, reject) {
				let transaction = self.db.transaction(['localStorage'], 'readwrite');
				transaction.oncomplete = (e) => {
					console.log('set ' + n + ' : ');
					console.log(v);
				}
				let objectStore = transaction.objectStore('localStorage');
				let request = objectStore.put({
					key : n,
					value : v
				});
				request.onsuccess = (e) => {
					//let r = e.target.result;
					window.setTimeout(() => {
					resolve(e);
					}, 5000);
				}
				request.onerror = (e) => {
					window.setTimeout(() => {
					//console.log(e);
					reject(e);
					}, 5000);
				}
				transaction.onerror = (e) => {
					window.setTimeout(() => {
					reject(e);
					}, 5000);
				}
				return;
			}
			let next = (o) => {
				this.
				this.c_task = null;
				if (this.wait_task) {
					let task = this.wait_task;
					task.pre.next = task.next;
					task.next.pre = task.pre;
					if (task.next === task) {
						this.wait_task = null;
					} else {
						this.wait_task = task.next;
					}
					task.h.next();
					this.c_task = {
						name : task.name,
						type : task.type,
						h : task.h
					};
				}
				return o;
			}
			let promise = new Promise((resolve, reject) => {
				h = f(resolve, reject);
			}).then(next, next);
			if (null === this.c_task) {
				h.next();
				this.c_task = {
					name : n,
					type : 'rw',
					h : h
				};
			} else {
				let task = {
					name : n,
					type : 'rw',
					h : h
				}
				if (this.wait_task) {
					task.next = this.wait_task;
					task.pre = this.wait_task.pre;
					task.pre.next = task;
					task.next.pre = task;
				} else {
					task.pre = task;
					task.next = task;
					this.wait_task = task;
				}
			}
			return promise;
		}
		//
		removeItem(n) {
			let transaction = this.db.transaction(['localStorage'], 'readwrite');
			let objectStore = transaction.objectStore('localStorage');
			let request = objectStore.delete(n);
			let promise = new Promise((resolve, reject) => {
				request.onsuccess = (e) => {
					let r = e.target.result;
					console.log(r);
					resolve(e);
				}
				request.onerror = (e) => {
					console.log(e);
					reject(e);
				}
				transaction.onerror = (e) => {
					reject(e);
				}
			});
			return promise;
		}
		//
		clear() {
			Promise.resolve(() => {
				console.log('not implement');
			});
		}
		key(v) {
			Promise.resolve(() => {
				console.log('not implement');
			});
		}
	}

	window.ls = new IndexedDB_Storage();
}
