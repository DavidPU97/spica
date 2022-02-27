import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenAlertComponent } from './token-alert.component';

describe('TokenAlertComponent', () => {
  let component: TokenAlertComponent;
  let fixture: ComponentFixture<TokenAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
