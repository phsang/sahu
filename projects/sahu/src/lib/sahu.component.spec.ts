import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SahuComponent } from './sahu.component';

describe('SahuComponent', () => {
  let component: SahuComponent;
  let fixture: ComponentFixture<SahuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SahuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SahuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
