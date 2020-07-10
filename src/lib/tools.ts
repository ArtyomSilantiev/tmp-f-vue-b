export function getValue (object: any, path: string) {
  let res;

  let pathParts = path.split('.');
  let cKey = pathParts.shift();

  function get (pObj: any, pKey: string) {
    let bracketStart, bracketEnd, res;

    bracketStart = pKey.indexOf('[');
    if (bracketStart > -1) {
      bracketEnd = pKey.indexOf(']');
      let arrIndex = pKey.substr(
        bracketStart + 1,
        bracketEnd - bracketStart - 1
      );
      pKey = pKey.substr(0, bracketStart);
      let n = pObj[pKey];
      res = n ? n[arrIndex] : undefined;
    } else {
      res = pObj[pKey];
    }
    return res;
  }

  res = get(object, cKey || '');
  if (res) {
    while (pathParts.length) {
      res = get(res, pathParts.shift() || '');
    }
  }
  return res;
}

export class AsyncLocker {
  protected resolves: Array<Function> = [];
  protected curLocks = 0;
  protected maxLocks = 1;

  constructor (maxLocks?: number) {
    if (maxLocks && maxLocks > 1) {
      this.maxLocks = maxLocks;
    }
  }

  public async join () {
    if (this.curLocks >= this.maxLocks) {
      await new Promise((resolve: Function) => {
        this.resolves.push(resolve);
      });
    }
    this.curLocks++;
  }

  public leave () {
    let resolve;
    if (this.resolves.length > 0) {
      resolve = this.resolves.shift();
    }
    this.curLocks--;
    if (resolve) {
      resolve();
    }
  }
}
