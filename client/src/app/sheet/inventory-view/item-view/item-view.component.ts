import { Component, Input } from '@angular/core';
import { Hoverable } from 'src/app/common/hoverable';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
})
export class ItemViewComponent extends Hoverable {
  @Input() item!: Item;
}
