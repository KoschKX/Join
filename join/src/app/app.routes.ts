import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HelpComponent } from './help/help.component';
import { BoardComponent } from './board/board.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Auth route - accessible without authentication
  { path: 'auth', component: AuthComponent },
  
  // Public routes - accessible without authentication, standalone
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'imprint', component: LegalNoticeComponent },
  { path: 'legal', component: LegalNoticeComponent }, // Fallback for old links
  { path: 'help', component: HelpComponent },

  // All routes with MainContentComponent (navbar + content)
  {
    path: '',
    component: MainContentComponent,
    children: [
      // Protected routes - require authentication
      { path: '', component: SummaryComponent, canActivate: [AuthGuard] },
      { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
      { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard] },
      { path: 'add-task', component: AddTaskComponent, canActivate: [AuthGuard] },
      { path: 'board', component: BoardComponent, canActivate: [AuthGuard] },
    ]
  },

  // Redirect to auth if no route matches
  { path: '**', redirectTo: '/auth' }
];
