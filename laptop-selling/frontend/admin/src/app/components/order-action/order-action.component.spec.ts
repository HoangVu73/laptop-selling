import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderActionComponent } from './order-action.component';

describe('OrderActionComponent', () => {
  let component: OrderActionComponent;
  let fixture: ComponentFixture<OrderActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
