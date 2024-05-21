import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRoomModalComponent } from './join-room-modal.component';

describe('JoinRoomModalComponent', () => {
  let component: JoinRoomModalComponent;
  let fixture: ComponentFixture<JoinRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinRoomModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
