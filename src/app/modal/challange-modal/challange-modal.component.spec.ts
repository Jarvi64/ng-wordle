import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallangeModalComponent } from './challange-modal.component';

describe('ChallangeModalComponent', () => {
  let component: ChallangeModalComponent;
  let fixture: ComponentFixture<ChallangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallangeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChallangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
