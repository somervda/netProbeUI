import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { HostComponent } from './host/host.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'history/:id/:type', component: HistoryComponent },
  { path: 'host/:action/:id', component: HostComponent },
  { path: 'host/:action', component: HostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
