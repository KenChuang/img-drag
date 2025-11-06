import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCComponent } from './new-c.component';

describe('NewCComponent', () => {
  let component: NewCComponent;
  let fixture: ComponentFixture<NewCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
