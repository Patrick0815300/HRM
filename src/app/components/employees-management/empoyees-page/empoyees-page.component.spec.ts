import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpoyeesPageComponent } from './empoyees-page.component';

describe('EmpoyeesPageComponent', () => {
  let component: EmpoyeesPageComponent;
  let fixture: ComponentFixture<EmpoyeesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpoyeesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpoyeesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
