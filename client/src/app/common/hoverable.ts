export class Hoverable {
  _hovered: boolean = false;
  get hovered(): boolean {
    return this._hovered;
  }
  startHover() {
    this._hovered = true;
  }
  endHover() {
    this._hovered = false;
  }
}
