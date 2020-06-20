export default new (class {
  private keyPrefix = 'lsPrefix.'

  public setItem (key: string, value: any) {
    localStorage.setItem(this.keyPrefix + key, JSON.stringify(value));
  }

  public getItem (key: string) {
    let value = localStorage.getItem(this.keyPrefix + key);
    if (value) {
      value = JSON.parse(value);
    } else {
      value = null;
    }
    return value;
  }

  public delItem (key: string) {
    localStorage.removeItem(this.keyPrefix + key);
  }
});
